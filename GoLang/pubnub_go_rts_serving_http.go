func ServeHttp() {
    publicPath := os.Getenv("PUBNUB_STOCKS_PUBLIC")

    // Fallback to the local public folder
    if publicPath == "" {
        publicPath = "./public"
    }

    http.Handle("/", http.FileServer(http.Dir(publicPath)))
    http.HandleFunc("/get_configs", GetConfigsHandler)

    err := http.ListenAndServe(fmt.Sprintf(":%s", config.Port), nil)
    if err != nil {
        log.Fatal(err)
    }
}