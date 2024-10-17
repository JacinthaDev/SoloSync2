class DropItineraryActivitiesTable < ActiveRecord::Migration[7.2]
  def change
    drop_table :itinerary_activities, if_exists: true
  end
end
