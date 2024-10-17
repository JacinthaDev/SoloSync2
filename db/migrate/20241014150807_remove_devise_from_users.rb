class RemoveDeviseFromUsers < ActiveRecord::Migration[6.1]
  def change
    remove_columns :users, :encrypted_password, :reset_password_token, :reset_password_sent_at, :remember_created_at
  end
end
