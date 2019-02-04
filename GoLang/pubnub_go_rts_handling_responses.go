func Publish() {
	go pubnub.Publish(stock.Name, streamMessage, successChannel, errorChannel)
	go handleResponse(successChannel, errorChannel, messaging.GetNonSubscribeTimeout(), done)	
}

func handleResponse(successChannel, errorChannel chan []byte, timeout uint16,
        finishedChannel chan bool) {

	select {
    case success := <-successChannel:
            fmt.Printf("%s\n", success)
    case failure := <-errorChannel:
            fmt.Printf("ERROR: %s\n", failure)
    case <-time.After((time.Second * time.Duration(timeout)):
            fmt.Println("Request timeout")
    }

    finishedChannel <- true
}