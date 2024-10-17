require 'faker'
FactoryBot.define do
  factory :user do |f|
    f.first_name { Faker::Name.first_name }
    f.last_name { Faker::Name.last_name }
    f.email { Faker::Internet.unique.email }
    f.password { Faker::Internet.password(min_length: 6) }
    f.date_of_birth { Faker::Date.birthday }
    f.bio { Faker::Lorem.sentence }
  end
end
