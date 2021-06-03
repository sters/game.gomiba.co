
.PHONY: local-server
local-server:
	python3 -m http.server --bind 127.0.0.1 8080
