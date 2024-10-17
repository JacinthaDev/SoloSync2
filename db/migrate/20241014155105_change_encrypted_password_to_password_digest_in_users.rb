class ChangeEncryptedPasswordToPasswordDigestInUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :encrypted_password, :string
    rename_column :users, :encrypted_password, :password_digest
  end
end
