require 'rails_helper'

RSpec.describe "Api::Itineraries", type: :request do
  let!(:user) { FactoryBot.create(:user) } 
  let!(:itineraries) { FactoryBot.create_list(:itinerary, 3, user: user) }
  let(:itinerary) { itineraries.first }
  let(:valid_attributes) { { itinerary: { country: "Mexico", city: "Mexico City", start_date: Date.tomorrow, end_date: Date.tomorrow + 5.days , description: "I love to travel"} } }
  let(:invalid_attributes) { { itinerary: { country: nil, city: "Mexico City", start_date: Date.tomorrow, end_date: Date.tomorrow + 5.days } } }

  describe 'GET /api/users/:user_id/itineraries' do
    puts "HIII"
    before do
      post '/login', params: { user: { email: 'test@example.com', password: 'password' } }
    end

    it 'returns all itineraries for a user' do
      get "/api/users/#{user.id}/itineraries"
      expect(response).to have_http_status(:success)
      
      itineraries_response = JSON.parse(response.body)
      itineraries_response.each do |itinerary|
        expect(itinerary['user_id']).to eq(user.id)
      end
    end
  end

  describe 'POST /api/users/:user_id/itineraries' do
    context 'with valid parameters' do
      it 'creates a new itinerary' do
        expect {
          post "/api/users/#{user.id}/itineraries", params: valid_attributes
        }.to change(Itinerary, :count).by(1)
        
        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['itinerary']['city']).to eq('Mexico City')
      end
    end

    context 'with invalid parameters' do
      it 'does not create an itinerary' do
        post "/api/users/#{user.id}/itineraries", params: invalid_attributes
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to_not be_empty
      end
    end
  end

  describe 'PATCH /api/users/:user_id/itineraries/:id' do
    context 'with valid parameters' do
      it 'updates the itinerary' do
        patch "/api/users/#{user.id}/itineraries/#{itinerary.id}", params: { itinerary: { city: "Cancun" } }
        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['city']).to eq('Cancun')
      end
    end

    context 'with invalid parameters' do
      it 'does not update the itinerary' do
        patch "/api/users/#{user.id}/itineraries/#{itinerary.id}", params: { itinerary: { country: nil } }
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to_not be_empty
      end
    end
  end
end
