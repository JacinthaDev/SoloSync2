require 'rails_helper'

RSpec.describe "Api::Users", type: :request do
  let!(:users) { FactoryBot.create_list(:user, 3) }
  let(:user) { users.first } 
  let(:valid_attributes) { { user: { first_name: "John", last_name: "Doe", email: "john@example.com", password: "password", date_of_birth: "1990-01-01", bio: "Hello world!" } } }
  let(:invalid_attributes) { { user: { email: "invalid_email" } } }

  describe 'GET /api/users' do
    it 'returns all users' do
      get '/api/users'
      expect(response).to have_http_status(:success)
      users = JSON.parse(response.body)
      expect(users.size).to eq(3)
    end
  end

  describe 'GET /api/users/:id' do
    it 'returns the user' do
      get "/api/users/#{user.id}"
      expect(response).to have_http_status(:success)
      user_response = JSON.parse(response.body)
      expect(user_response['id']).to eq(user.id)
    end
  end

    context 'when the user does not exist' do
      it 'returns a not found error' do
        get '/api/users/99999' 
        expect(response).to have_http_status(:not_found)
        expect(json['error']).to eq('User not found')
      end
    end
  end

  describe 'GET /api/users/current' do
    context 'when user is signed in' do
      before do
        post '/login', params: { email: user.email, password: 'password' } 
      end

      it 'returns the current user' do
        get '/api/users/current'
        expect(response).to have_http_status(:success)
        expect(json['id']).to eq(user.id)
      end
    end

    context 'when user is not signed in' do
      it 'returns unauthorized error' do
        get '/api/users/current'
        expect(response).to have_http_status(:unauthorized)
        expect(json['error']).to eq('Not authenticated')
      end
    end
  end

  describe 'POST /api/users' do
    context 'with valid parameters' do
      it 'creates a new user' do
        expect {
          post '/signup', params: valid_attributes
        }.to change(User, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(json['message']).to eq('User created successfully.')
      end
    end

    context 'with invalid parameters' do
      it 'does not create a user' do
        post '/signup', params: invalid_attributes
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['error']).to_not be_empty
      end
    end
  end

  describe 'PATCH /api/users/:id' do
    context 'with valid parameters' do
      it 'updates the user' do
        patch "/api/users/#{user.id}", params: { user: { first_name: "Jane" } }
        expect(response).to have_http_status(:ok)
        expect(json['first_name']).to eq('Jane')
      end
    end

    context 'with invalid parameters' do
      it 'does not update the user' do
        patch "/api/users/#{user.id}", params: { user: { email: "invalid_email" } }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['error']).to_not be_empty
      end
    end
  end
end
