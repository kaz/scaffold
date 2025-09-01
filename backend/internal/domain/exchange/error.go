package exchange

//go:generate go-enum --noprefix --prefix Err

type (
	// ENUM(internal, not_found)
	Error uint8
)

func (e Error) Error() string {
	return e.String()
}
