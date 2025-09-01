package cli

import (
	"github.com/kaz/scaffold/backend/internal/cli/serve"
)

type (
	Command struct {
		Serve serve.Command `kong:"cmd"`
	}
)
