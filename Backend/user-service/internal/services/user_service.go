package services

import (
	"github.com/Huzaifa-314/klydos/user-service/internal/repository"
)

type UserService struct {
	userRepo *repository.UserRepository
}

func NewUserService(userRepo *repository.UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

// Additional business logic can be added here
// For now, handlers directly use repository, but this service layer
// provides a place for future business logic
