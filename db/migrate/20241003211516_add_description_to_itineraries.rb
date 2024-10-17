class AddDescriptionToItineraries < ActiveRecord::Migration[7.2]
  def change
    add_column :itineraries, :description, :text
  end
end
