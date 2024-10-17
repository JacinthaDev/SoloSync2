module Api
  class CommentsController < ApplicationController
    before_action :set_itinerary
    before_action :authenticate_user!
    before_action :set_comment, only: %i[ show update destroy ]

    def index
      @comments = @itinerary.comments.includes(:user).order(:created_at)

      render json: @comments, include: :user
    end

    def show
      render json: @comment
    end

    def create
      @comment = @itinerary.comments.build(comment_params)
      @comment.user = current_user

      if @comment.save
        render json: @comment, status: :created 
      else
        render json: @comment.errors, status: :unprocessable_entity
      end
    end

    def edit
    end

    def update
      if @comment.update(comment_params)
        render json: @comment
      else
        render json: @comment.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @comment.destroy!
    end

    private

    def set_comment
      @comment = Comment.find(params[:id])
    end
      
    def set_itinerary
      @itinerary = Itinerary.find(params[:itinerary_id])
    end

    def comment_params
      params.require(:comment).permit(:user_id, :itinerary_id, :content)
    end
  end
end

