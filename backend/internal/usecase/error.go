package usecase

//go:generate go-enum --noprefix --prefix Err

type (
	// ENUM(not_found, internal)
	Error uint8
)

func (e Error) Error() string {
	return e.String()
}
