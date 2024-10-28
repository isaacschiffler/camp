export interface Trip {
  title: string;
  startDate: Date;
  endDate: Date;
  members: Array<User>;
  location: Location;
  activities?: Array<string>;
  gear: Array<string>;
  image_urls: Array<string>;
}

export interface User {
  name: string;
  id: number;
}

export interface Location {
  region: string;
  campsite: Array<string>;
}
