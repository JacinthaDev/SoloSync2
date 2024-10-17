module Users
  class SessionsController < ApplicationController

    def create
      user = User.find_by(email: params[:user][:email]) 
  
      if user && user.authenticate(params[:user][:password]) 
        session[:user_id] = user.id
        render json: { user_id: user.id, user: user}, status: :ok
      else
        render json: { error: 'Invalid email or password' }, status: :unauthorized
      end
    end

    def destroy
      session[:user_id] = nil
      render json: { message: 'You are logged out.' }, status: :ok
    end
  end
end
