package main

import (
	"github.com/alecthomas/kong"
	"github.com/kaz/scaffold/backend/internal/cli"
)

func main() {
	ctx := kong.Parse(new(cli.Command))
	ctx.FatalIfErrorf(ctx.Run())
}
