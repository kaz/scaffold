package infra

//go:generate go-enum --noprefix --prefix Err

type (
	// ENUM(not_configured)
	Error uint8
)

func (e Error) Error() string {
	return e.String()
}
