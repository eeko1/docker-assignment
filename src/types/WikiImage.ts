type WikiImage = {
  batchcomplete: boolean;
  query: Query;
};

type Query = {
  normalized: Normalized[];
  pages: Page[];
};

type Normalized = {
  fromencoded: boolean;
  from: string;
  to: string;
};

type Page = {
  pageid: number;
  ns: number;
  title: string;
  thumbnail: Thumbnail;
  pageimage: string;
};

type Thumbnail = {
  source: string;
  width: number;
  height: number;
};

export default WikiImage;
