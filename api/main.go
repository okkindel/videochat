///usr/bin/env go run $0 $@ ; exit

package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-redis/redis"
	"github.com/gorilla/handlers"
)

func main() {
	time.Sleep(time.Second)
	configFilePath := flag.String("config_file", "./config.json", "config.json file path")

	config, err := GetConfig(*configFilePath)
	log.SetOutput(os.Stdout)
	if err != nil {
		log.Panic(err.Error())
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr:       config.Redis.URL,
		DB:         0,
		MaxRetries: 2,
	})

	tokenStorage := NewTokenStorage(redisClient, config.OAuth.ClientID, config.OAuth.Secret, config.OAuth.RedirectURI)

	api := NewApi(tokenStorage, config)

	cors := handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "OPTIONS"}),
		handlers.AllowedOrigins([]string{"*"}))
	logMid := handlers.LoggingHandler(os.Stdout, cors(api))

	log.Println("Server starting on port:", config.Port)
	if err := http.ListenAndServe(":"+config.Port, logMid); err != nil {
		log.Panic("Failed to run:", err)
	}
}
