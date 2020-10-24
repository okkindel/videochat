package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"path/filepath"
)

type Config struct {
	Port              string `json:"port"`
	CallServiceDomain string `json:"call_url"`
	ImageURL          string `json:"image_url"`
	WebhookURL        string `json:"webhook_url"`
	WebhookSecret     string `json:"webhook_secret"`
	Services          struct {
		Redis struct {
			URL string `json:"url"`
		} `json:"redis"`
	} `json:"services"`
	OAuth struct {
		ClientID    string `json:"client_id"`
		Secret      string `json:"client_secret"`
		RedirectURI string `json:"redirect_uri"`
	} `json:"oauth"`
	Redis struct {
		URL string `json:"url"`
	} `json:"redis"`
	VideoServiceURI string `json:"vs_uri"`
}

func GetConfig(configPath string) (*Config, error) {
	configFileAbsPath, err := filepath.Abs(configPath)
	if err != nil {
		return nil, err
	}
	config := &Config{}
	file, err := os.Open(configFileAbsPath)
	defer file.Close()
	if err != nil {
		return nil, err
	}
	configFile, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(configFile, &config); err != nil {
		return nil, err
	}

	return config, nil
}
