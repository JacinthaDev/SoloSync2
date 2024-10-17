class User < ApplicationRecord
  has_secure_password
  has_one_attached :profile_picture
  has_many :itineraries, dependent: :destroy
  has_many :comments, through: :itineraries
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }

  def profile_picture_url
    profile_picture.attached? ? Rails.application.routes.url_helpers.rails_blob_path(profile_picture, only_path: true) : nil
  end
end
