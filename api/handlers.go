package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/google/uuid"
	"github.com/livechat/lc-sdk-go/v2/agent"
	"github.com/livechat/lc-sdk-go/v2/configuration"
	"github.com/livechat/lc-sdk-go/v2/objects"
	"github.com/livechat/lc-sdk-go/v2/webhooks"
)

type basicResp struct {
	Result string `json:"result"`
}

type Handlerer struct {
	tokens        *TokenStorage
	webhookSecret string
	webhookURL    string
	callDomain    string
	imageURL      string
}

func NewHandlerer(client *TokenStorage, webhookSecret, webhookURL, callDomain, imageURL string) *Handlerer {
	return &Handlerer{
		tokens:        client,
		webhookSecret: webhookSecret,
		webhookURL:    webhookURL,
		callDomain:    callDomain,
		imageURL:      imageURL,
	}
}

func (h *Handlerer) sendJSON(rw http.ResponseWriter, status int, payload interface{}, err error) {
	if err != nil {
		log.Println(err)
	}
	rw.Header().Set("Content-Type", "application/json")
	resp, err := json.Marshal(payload)
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte("{}"))
		return
	}

	rw.WriteHeader(status)
	rw.Write(resp)
}

func (h *Handlerer) Ping(rw http.ResponseWriter, req *http.Request) {
	h.sendJSON(rw, http.StatusOK, &basicResp{"OK"}, nil)
}

func (h *Handlerer) HandleInstallation(rw http.ResponseWriter, req *http.Request) {
	code := req.URL.Query().Get("code")
	log.Printf("code: %s\n", code)
	if code == "" {
		h.sendJSON(rw, http.StatusBadRequest, map[string]string{"error": "Missing 'code' in request"}, nil)
		return
	}

	token, err := h.tokens.GetTokenForCode(code)
	if err != nil {
		h.sendJSON(rw, http.StatusBadRequest, map[string]string{"error": "Wrong 'code' in request"}, err)
		return
	}

	if err := h.tokens.StoreToken(token.LicenseID, token); err != nil {
		h.sendJSON(rw, http.StatusInternalServerError, map[string]string{"error": "Internal Error"}, err)
		return
	}

	api, err := configuration.NewAPI(h.tokens.MakeTokenGetterForLicense(token.LicenseID), http.DefaultClient, h.tokens.ClientID)
	if err != nil {
		h.sendJSON(rw, http.StatusInternalServerError, map[string]string{"error": "Internal Error"}, err)
		return
	}

	webhooksToRegister := []*configuration.Webhook{
		{
			Action:      "incoming_chat",
			SecretKey:   h.webhookSecret,
			URL:         h.webhookURL,
			Description: "txtless call",
		},
		{
			Action:      "incoming_rich_message_postback",
			SecretKey:   h.webhookSecret,
			URL:         h.webhookURL,
			Description: "txtless call",
		},
	}

	for _, wh := range webhooksToRegister {
		if _, err := api.RegisterWebhook(wh); err != nil {
			h.sendJSON(rw, http.StatusInternalServerError, map[string]string{"error": "Internal Error"}, err)
			return
		}
	}

	h.sendJSON(rw, http.StatusOK, map[string]string{"status": "Success"}, err)
	return
}

func (h *Handlerer) GetWebhookHandler() func(rw http.ResponseWriter, req *http.Request) {
	whConfig := webhooks.NewConfiguration()
	whConfig.
		WithAction("incoming_chat", h.handleIncomingChat, h.webhookSecret).
		WithAction("incoming_rich_message_postback", h.handleIncomingRichMessagePostback, h.webhookSecret)
	whConfig.WithErrorHandler(h.errorWebhookHandler)
	return webhooks.NewWebhookHandler(whConfig)
}

func (h *Handlerer) handleIncomingChat(webhook *webhooks.Webhook) error {
	incomingChatWebhook, ok := webhook.Payload.(*webhooks.IncomingChat)
	if !ok {
		return fmt.Errorf("Error asserting %T to `*webhooks.IncomingChat`", webhook.Payload)
	}

	agentAPI, err := agent.NewAPI(h.tokens.MakeTokenGetterForLicense(webhook.LicenseID), http.DefaultClient, h.tokens.ClientID)
	if err != nil {
		return err
	}

	uuidID := uuid.New().String()

	callUrl, err := url.Parse(h.callDomain)
	if err != nil {
		return fmt.Errorf("Cant parse url: %w", err)
	}
	query := callUrl.Query()
	query.Set("myID", uuidID)
	query.Set("targetID", "")
	callUrl.RawQuery = query.Encode()

	richEvent := &objects.RichMessage{
		Event: objects.Event{
			Recipients: "all",
			Type:       "rich_message",
		},
		TemplateID: "cards",
		Elements: []objects.RichMessageElement{
			{
				Title:    "Call Agent!",
				Subtitle: "Start call with your agent now!",
				Buttons: []objects.RichMessageButton{
					{
						Type:       "url",
						Text:       "Call!",
						PostbackID: "call:" + uuidID,
						UserIds:    []string{},
						Value:      callUrl.String(),
					},
				},
				Image: &objects.RichMessageImage{
					Name:        "Make A Call",
					URL:         h.imageURL,
					ContentType: "image/png",
					Width:       640,
					Height:      480,
				},
			},
		},
	}
	_, err = agentAPI.SendEvent(incomingChatWebhook.Chat.ID, richEvent, true)
	return err
}

func (h *Handlerer) handleIncomingRichMessagePostback(webhook *webhooks.Webhook) error {
	incomingPostbackWebhook, ok := webhook.Payload.(*webhooks.IncomingRichMessagePostback)
	if !ok {
		return fmt.Errorf("Error asserting %T to `*webhooks.IncomingChat`", webhook)
	}

	agentAPI, err := agent.NewAPI(h.tokens.MakeTokenGetterForLicense(webhook.LicenseID), http.DefaultClient, h.tokens.ClientID)
	if err != nil {
		return err
	}

	postback := strings.Split(incomingPostbackWebhook.Postback.ID, ":")
	if len(postback) != 2 {
		return fmt.Errorf("Wrong postback id: `%v`", postback)
	}

	uuidID := uuid.New().String()

	callUrl, err := url.Parse(h.callDomain)
	if err != nil {
		return fmt.Errorf("Cant parse url: %w", err)
	}

	query := callUrl.Query()
	query.Set("myID", uuidID)
	query.Set("targetID", postback[1])
	callUrl.RawQuery = query.Encode()

	mesage := &objects.Message{
		Event: objects.Event{
			Recipients: "agents",
			Type:       "message",
		},
		Text: fmt.Sprintf("Join call from client on: %s", callUrl.String()),
	}

	_, err = agentAPI.SendEvent(incomingPostbackWebhook.ChatID, mesage, true)
	return err
}

func (h *Handlerer) errorWebhookHandler(w http.ResponseWriter, err string, statusCode int) {
	h.sendJSON(w, http.StatusOK, &basicResp{"OK"}, errors.New(err))
}
