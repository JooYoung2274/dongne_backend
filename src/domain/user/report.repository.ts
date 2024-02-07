import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Reports } from '../entities/report';
import { reportDto } from './dto/request.report.dto';

@Injectable()
export class ReportsRepository extends Repository<Reports> {
  constructor(private dataSource: DataSource) {
    super(Reports, dataSource.createEntityManager());
  }

  async createReport(dto: reportDto, userId: number): Promise<void> {
    const { reason, ReportedId } = dto;
    const newReport = this.create();
    newReport.ReportedId = ReportedId;
    newReport.reason = reason;
    newReport.UserId = userId;
    await this.save(newReport);
  }
}
