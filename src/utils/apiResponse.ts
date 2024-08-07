// utils/apiResponse.ts
export class ApiResponse {
  constructor(
    public status: number,
    public data: any,
    public message: string
  ) {}
}
