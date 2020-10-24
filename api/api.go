package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func NewApi(ts *TokenStorage, conf *Config) http.Handler {
	router := mux.NewRouter()
	handlerer := NewHandlerer(ts, conf.WebhookSecret, conf.WebhookURL, conf.CallServiceDomain, conf.ImageURL)
	router.HandleFunc("/ping", handlerer.Ping).Methods("OPTIONS", "GET")
	router.HandleFunc("/setup", handlerer.HandleInstallation).Methods("OPTIONS", "GET")
	router.HandleFunc("/webhook", handlerer.GetWebhookHandler()).Methods("OPTIONS", "POST")

	return router
}
