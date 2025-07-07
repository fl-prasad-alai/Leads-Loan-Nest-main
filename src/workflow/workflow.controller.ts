import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/upload.middleware';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get('config')
  getAllWorkflows() {
    return this.workflowService.getAllWorkflows();
  }

  @Post('config')
  saveWorkflow(@Body() body: { name: string; steps: string[] }) {
    return this.workflowService.saveWorkflow(body.name, body.steps);
  }

  @Delete('config/:name')
  deleteWorkflow(@Param('name') name: string) {
    return this.workflowService.deleteWorkflow(name);
  }

    @Post('execute/:name')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'panDoc', maxCount: 1 },
        { name: 'aadhaarDoc', maxCount: 1 },
        { name: 'gstDoc', maxCount: 1 },
      ],
      multerOptions
    )
  )
  async executeWorkflow(
    @Param('name') name: string,
    @UploadedFiles()
    files: {
      panDoc?: Express.Multer.File[];
      aadhaarDoc?: Express.Multer.File[];
      gstDoc?: Express.Multer.File[];
    },
    @Body() body: any
  ): Promise<{ message: string; lead_id?: number; loan_id?: number }> {
    try {
      let input: any;

      if (typeof body.data === 'string') {
        input = JSON.parse(body.data);
      } else {
        input = body.data || {};
      }

      input.documents = [
        ...(files.panDoc || []),
        ...(files.aadhaarDoc || []),
        ...(files.gstDoc || []),
      ];

      const result = await this.workflowService.executeWorkflow(name, input);

      return {
        message: 'Lead created',
        lead_id: result.lead?.lead_id,
        loan_id: result.loan?.loan_id,
      };
    } catch (error) {
      console.error('ERROR EXECUTING WORKFLOW:', error);
      throw new Error('Internal Server Error');
    }
  }

  }

