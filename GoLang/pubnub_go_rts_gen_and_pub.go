func (stock *Stock) UpdateValuesAndPublish(pubnub *messaging.Pubnub, cycle chan bool) {
	streamMessage := StreamMessage{
        Time:       time.Now().Format(TIME_FORMAT),
        Price:      fmt.Sprintf("%.2f", stock.CurrentPrice),
        Delta:      fmt.Sprintf("%.2f", delta),
        Percentage: fmt.Sprintf("%.2f", percentage),
        Vol:        vol}
	...
	go pubnub.Publish(stock.Name, streamMessage, successChannel, errorChannel)
	...
	sleep := Randn(stock.MinTrade, stock.MaxTrade)
	time.Sleep(time.Duration(sleep) * time.Microsecond)

	cycle <- <-done
}