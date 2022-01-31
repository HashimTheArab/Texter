package main

import (
	"github.com/gorilla/websocket"
	"net/http"
	"strconv"
)

var clients = map[*websocket.Conn]bool{}
var upgrader = websocket.Upgrader{}
var broadcast = make(chan []byte)
var btype = make(chan int)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./front")))
	http.HandleFunc("/ws", func(writer http.ResponseWriter, request *http.Request) {
		upgrader.CheckOrigin = func(r *http.Request) bool {
			return true
		}
		conn, err := upgrader.Upgrade(writer, request, nil)
		if err != nil {
			panic(err)
		}
		defer func(ws *websocket.Conn) {
			err := ws.Close()
			if err != nil {
				panic(err)
			}
		}(conn)
		clients[conn] = true
		for {
			msgType, msg, err := conn.ReadMessage()
			if err != nil {
				return
			}

			broadcast <- msg
			btype <- msgType
			println("Message Received (" + strconv.Itoa(msgType) + "): " + string(msg))
		}
	})
	go func(){
		for {
			msg := <- broadcast
			t := <- btype
			for client := range clients {
				if err := client.WriteMessage(t, msg); err != nil {
					_ = client.Close()
					delete(clients, client)
				}
			}
		}
	}()

	println("Starting server!")
	if err := http.ListenAndServe(":80", nil); err != nil {
		panic(err)
	}
}
