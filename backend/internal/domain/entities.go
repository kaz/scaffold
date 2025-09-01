package domain

type (
	Symbol string
	Price  struct {
		Bid float64
		Ask float64
	}
)

func (s Symbol) String() string {
	return string(s)
}
