# require 'rails_helper'

# RSpec.describe Api::UsersController, type: :request do
#   let(:user) { create(:user) }
#   let(:valid_attributes) { { user: { email: "new_user@example.com", password: "password", first_name: "John", last_name: "Doe" } } }
#   let(:invalid_attributes) { { user: { email: "", password: "short", first_name: "John" } } }

#   describe 'GET #index' do
#     it 'returns a list of users' do
#       create_list(:user, 3)
#       get api_users_path
#       expect(response).to have_http_status(:ok)
#       expect(json.size).to eq(3)
#     end
#   end

#   describe 'GET #show' do
#     it 'returns user details' do
#       get api_user_path(user)
#       expect(response).to have_http_status(:ok)
#       expect(json['email']).to eq(user.email)
#     end

#     it 'returns not found if user does not exist' do
#       get api_user_path(id: 9999)
#       expect(response).to have_http_status(:not_found)
#       expect(json['error']).to eq('User not found')
#     end
#   end

#   describe 'POST #create' do
#     it 'creates a new user' do
#       post api_users_path, params: valid_attributes
#       expect(response).to have_http_status(:created)
#       expect(json['message']).to eq('User created successfully.')
#     end

#     it 'does not create a user with invalid attributes' do
#       post api_users_path, params: invalid_attributes
#       expect(response).to have_http_status(:unprocessable_entity)
#       expect(json['error']).to include("can't be blank")
#     end
#   end

#   describe 'PATCH #update' do
#     it 'updates the user' do
#       patch api_user_path(user), params: { user: { first_name: "Updated Name" } }
#       expect(response).to have_http_status(:ok)
#       expect(user.reload.first_name).to eq("Updated Name")
#     end

#     it 'returns unprocessable entity if update fails' do
#       patch api_user_path(user), params: { user: { email: "" } }
#       expect(response).to have_http_status(:unprocessable_entity)
#       expect(json['email']).to include("can't be blank")
#     end
#   end

#   describe 'GET #current_user' do
#     context 'when user is signed in' do
#       before { sign_in user }

#       it 'returns the current user' do
#         get current_user_api_users_path
#         expect(response).to have_http_status(:ok)
#         expect(json['email']).to eq(user.email)
#       end
#     end

#     context 'when user is not signed in' do
#       it 'returns unauthorized' do
#         get current_user_api_users_path
#         expect(response).to have_http_status(:unauthorized)
#         expect(json['error']).to eq('Not authenticated')
#       end
#     end
#   end

#   describe 'GET #show_other_user' do
#     it 'returns details of another user' do
#       get show_other_user_api_users_path(user_id: user.id)
#       expect(response).to have_http_status(:ok)
#       expect(json['user']['email']).to eq(user.email)
#     end

#     it 'returns not found if user does not exist' do
#       get show_other_user_api_users_path(user_id: 9999)
#       expect(response).to have_http_status(:not_found)
#       expect(json['error']).to eq('User not found')
#     end
#   end
# end
