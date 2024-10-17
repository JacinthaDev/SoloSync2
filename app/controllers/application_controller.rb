class ApplicationController < ActionController::API
  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) 
  end

  def authenticate_user!
    render json: { error: 'Not authorized' }, status: :unauthorized unless current_user
  end
end
