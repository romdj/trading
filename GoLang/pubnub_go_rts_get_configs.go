func GetConfigsHandler(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(
        fmt.Sprintf("{\"publish_key\": \"%s\", \"subscribe_key\": \"%s\"}",
            config.Keys.Pub, config.Keys.Sub)))
}