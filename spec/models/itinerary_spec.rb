require 'rails_helper'

RSpec.describe Itinerary, type: :model do
  subject { Itinerary.new(country: "Mexico", city: "Mexico City", start_date: Date.tomorrow, end_date: Date.tomorrow + 5.days, user: user) }
  let(:user) { User.create(first_name: "Jack", last_name: "Smith", email: "jsmith@sample.com", password: "password123") }

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a country" do
    subject.country = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a city" do
    subject.city = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a start_date" do
    subject.start_date = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without an end_date" do
    subject.end_date = nil
    expect(subject).to_not be_valid
  end

  it "is not valid if the start_date is in the past" do
    subject.start_date = Date.yesterday
    expect(subject).to_not be_valid
  end

  it "is not valid if the end_date is before the start_date" do
    subject.end_date = subject.start_date - 1.day
    expect(subject).to_not be_valid
  end
end
