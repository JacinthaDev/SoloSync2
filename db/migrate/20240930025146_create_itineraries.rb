class CreateItineraries < ActiveRecord::Migration[7.2]
  def change
    create_table :itineraries do |t|
      t.date :start_date
      t.date :end_date
      t.string :country
      t.string :city
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
