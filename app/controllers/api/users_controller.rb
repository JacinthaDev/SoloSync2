class Api::UsersController < ApplicationController
  before_action :set_user, only: [:update]

  def index
    @users = User.all
    render json: @users
  end

  def show
    @user = User.find(session[:user_id])
    
    render json: @user.as_json.merge(
      profile_picture: @user.profile_picture.attached? ? url_for(@user.profile_picture) : nil
    )
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end
  
  def current_user
    if user_signed_in? 
      render json: current_user
    else
      render json: { error: 'Not authenticated' }, status: :unauthorized
    end
  end

  def create
    user = User.new(user_params)
    if user.save
      session[:user_id] = user.id
      render json: { message: 'User created successfully.', user_id: user.id, user: user}, status: :created
    else
      render json: { error: user.errors.full_messages }, status: :unprocessable_entity
    end
  end


  def update
    @user = User.find(params[:id])

    if params[:user][:profile_picture].present?
      @user.profile_picture.attach(params[:user][:profile_picture])
    end
  
    if @user.update(user_params)
      render json: @user, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def show_other_user
    user = User.find(params[:user_id])
    itineraries = user.itineraries
  
    render json: {
      user: user.as_json.merge(
        profile_picture: user.profile_picture.attached? ? url_for(user.profile_picture) : nil
      ),
      itineraries: itineraries
    }
  end
  

  private

  def set_user
    @user = User.find(params[:id])
  end
  
  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name, :date_of_birth, :bio, :profile_picture)
  end
  
end