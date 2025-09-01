package interceptor

import (
	"context"
	"errors"
	"log/slog"

	"connectrpc.com/connect"
	"github.com/kaz/scaffold/backend/internal/usecase"
)

func NewErrorHandleInterceptor() connect.UnaryInterceptorFunc {
	return connect.UnaryInterceptorFunc(func(next connect.UnaryFunc) connect.UnaryFunc {
		return connect.UnaryFunc(func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			resp, err := next(ctx, req)
			if err != nil {
				if errors.Is(err, usecase.ErrNotFound) {
					return nil, connect.NewError(connect.CodeNotFound, usecase.ErrNotFound)
				}

				slog.ErrorContext(ctx, "unexpected error occurred", slog.Any("error", err), slog.String("procedure", req.Spec().Procedure))
				return nil, connect.NewError(connect.CodeInternal, usecase.ErrInternal)
			}

			return resp, nil
		})
	})
}
