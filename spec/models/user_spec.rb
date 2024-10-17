require 'rails_helper'

RSpec.describe User, type: :model do
  subject { User.new(first_name: "Jack", last_name: "Smith", email: "jsmith@sample.com", password: "password123", date_of_birth: "1990-01-01", bio: "This is my bio.") }

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a first_name" do
    subject.first_name = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a last_name" do
    subject.last_name = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without an email" do
    subject.email = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a password" do
    subject.password = nil
    expect(subject).to_not be_valid
  end

  it "is not valid if the email address is not formatted correctly" do
    subject.email = "jsmithsample.com"
    expect(subject).to_not be_valid
  end

  it "is not valid if the password is too short" do
    subject.password = "short"
    expect(subject).to_not be_valid
  end

  it "returns the correct profile_picture_url" do
    expect(subject.profile_picture_url).to be_nil
  end
end
