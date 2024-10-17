# require 'rails_helper'

# RSpec.describe Api::ItinerariesController, type: :request do
#   let(:user) { create(:user) }
#   let(:itinerary) { create(:itinerary, user: user) }
  
#   before do
#     post '/api/auth/login', params: { email: user.email, password: 'password' }
#     @auth_token = response.headers['Authorization']
#   end

#   describe 'GET #feed' do
#     it 'returns itineraries' do
#       get '/api/itineraries/feed', headers: { 'Authorization' => @auth_token }
#       expect(response).to have_http_status(:ok)
#       expect(json.size).to eq(1)
#     end
#   end

#   describe 'GET #index' do
#     it 'returns itineraries for the user' do
#       get '/api/itineraries', headers: { 'Authorization' => @auth_token }
#       expect(response).to have_http_status(:ok)
#       expect(json.size).to eq(1)
#     end
#   end

#   describe 'POST #create' do
#     it 'creates a new itinerary' do
#       post '/api/itineraries', params: { itinerary: { country: "Canada", city: "Toronto", start_date: Date.tomorrow, end_date: Date.tomorrow + 7.days } }, headers: { 'Authorization' => @auth_token }
#       expect(response).to have_http_status(:created)
#       expect(json['itinerary']['city']).to eq("Toronto")
#     end
#   end

#   describe 'PATCH #update' do
#     it 'updates an itinerary' do
#       patch "/api/itineraries/#{itinerary.id}", params: { itinerary: { city: "Los Angeles" } }, headers: { 'Authorization' => @auth_token }
#       expect(response).to have_http_status(:ok)
#       expect(itinerary.reload.city).to eq("Los Angeles")
#     end
#   end

#   describe 'DELETE #destroy' do
#     it 'deletes an itinerary' do
#       delete "/api/itineraries/#{itinerary.id}", headers: { 'Authorization' => @auth_token }
#       expect(response).to have_http_status(:ok)
#       expect { itinerary.reload }.to raise_error(ActiveRecord::RecordNotFound)
#     end
#   end
# end