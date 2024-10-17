Rails.application.routes.draw do
  namespace :api do
    resources :users do
      patch 'upload_profile_picture', on: :member
      resources :itineraries, except: [:cities] do
        resources :comments
      end
    end

    get '/users/current', to: 'users#current_user'
    get '/itineraries/feed', to: 'itineraries#feed'
    get '/countries', to: 'itineraries#countries'
    get '/cities', to: 'itineraries#cities'
  end

  post '/signup', to: 'api/users#create' 
  post '/login', to: 'users/sessions#create'
  delete '/logout', to: 'users/sessions#destroy'

  get '/api/users/:user_id/user-profile', to: 'api/users#show_other_user'

  resources :users, only: [:index, :show]


  # Health check route 
  get "up" => "rails/health#show", as: :rails_health_check
end
