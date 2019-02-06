type Config struct {
    Port               string `json:"port"`
    GrantTTL           int    `json:"grant_ttl"`
    StocksChannelGroup string `json:"stocks_channel_goroup"`
    HistoryChannel     string `json:"history_channel"`
    ChatChannel        string `json:"chat_channel"`
    Keys               struct {
        Pub    string `json:"publish_key"`
        Sub    string `json:"subscribe_key"`
        Secret string `json:"secret_key"`
        Auth   string `json:"auth_key"`
    }
}