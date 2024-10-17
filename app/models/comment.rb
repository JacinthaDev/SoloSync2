class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :itinerary

  validates :content, presence: true
  validates :itinerary, presence: true
  validates :user, presence: true
end
