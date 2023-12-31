export interface AddressResponse {
  documents: Array<{
    address_name: string;
    address_type: 'REGION' | 'ROAD' | 'REGION_ADDR' | 'ROAD_ADDR';
    place_name?: string;
    x?: string;
    y?: string;
    address: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      region_3depth_h_name: string;
      b_code: string;
      mountain_yn: string;
      main_address_no: string;
      sub_address_no: string;
      x: string;
      y: string;
    };
    road_address: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      road_name: string;
      underground_yn: string;
      main_building_no: string;
      sub_building_no: string;
      building_name: string;
      zone_no: string;
      x: string;
      y: string;
    };
  }>;
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}
