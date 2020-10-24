package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/go-redis/redis"
	"github.com/livechat/lc-sdk-go/v2/authorization"
)

type Token struct {
	AccessToken string `json:"access_token"`
	LicenseID   int    `json:"license_id"`
	Region      string `json:"-"`
}

type TokenStorage struct {
	cache        *redis.Client
	client       *http.Client
	ClientID     string
	ClientSecret string
	RedirectURI  string
}

func NewTokenStorage(client *redis.Client, clientID string, clientSecret string, redirectURI string) *TokenStorage {
	return &TokenStorage{
		cache:        client,
		client:       http.DefaultClient,
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURI:  redirectURI,
	}
}

func (ts *TokenStorage) GetTokenForCode(code string) (*Token, error) {
	reqBody := map[string]interface{}{
		"grant_type":    "authorization_code",
		"code":          code,
		"client_id":     ts.ClientID,
		"client_secret": ts.ClientSecret,
		"redirect_uri":  ts.RedirectURI,
	}

	t := &Token{}
	reqBodyMarshaled, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	r, err := http.NewRequest("POST", "https://accounts.livechat.com/token", bytes.NewBuffer(reqBodyMarshaled))
	if err != nil {
		return nil, err
	}

	log.Println("Code request: %+v", r)

	resp, err := ts.client.Do(r)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("cant get token: %v", string(body))
	}

	if err := json.Unmarshal(body, &t); err != nil {
		return nil, err
	}

	tokenSplited := strings.Split(t.AccessToken, ":")
	t.Region = tokenSplited[0]

	return t, nil
}

func (ts *TokenStorage) MakeTokenGetterForLicense(license int) authorization.TokenGetter {
	return func() *authorization.Token {
		token, err := ts.GetToken(license)
		if err != nil {
			return nil
		}
		return &authorization.Token{
			LicenseID:   &license,
			AccessToken: token.AccessToken,
			Region:      token.Region,
			Type:        authorization.BearerToken,
		}
	}
}

func (ts *TokenStorage) StoreToken(license int, token *Token) error {
	marshaled, err := json.Marshal(token)
	if err != nil {
		return err
	}
	return ts.cache.Set(fmt.Sprintf("token:%d", license), string(marshaled), 0).Err()
}

func (ts *TokenStorage) GetToken(license int) (*Token, error) {
	rawToken, err := ts.cache.Get(fmt.Sprintf("token:%d", license)).Result()
	if err != nil {
		return nil, err
	}

	token := &Token{}
	if err := json.Unmarshal([]byte(rawToken), &token); err != nil {
		return nil, err
	}

	return token, nil
}

func (ts *TokenStorage) GetTokenForLicense(license int) (string, error) {
	return ts.cache.Get(fmt.Sprintf("token:%d", license)).Result()
}

func (ts *TokenStorage) SetTokenForLicense(license int, token string) error {
	return ts.cache.Set(fmt.Sprintf("token:%d", license), token, 0).Err()
}
