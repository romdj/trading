func RunStocks() {
	done := make(chan bool)

	for _, stock := range stocks {
		go func(st Stock) {
			fmt.Printf("Starting up %s\n", st.Name)
			st.RunCycle()
		}(stock)
	}

	<-done
}