require 'faker'

FactoryBot.define do
  factory :itinerary do
    association :user
    country { Faker::Address.country }
    city { Faker::Address.city }
    start_date { Faker::Date.forward(days: 7) }

    transient do
      duration { Faker::Number.between(from: 1, to: 14) }
    end

    end_date { start_date + duration.days }
    description { Faker::Lorem.sentence(word_count: 10) }
  end
end
