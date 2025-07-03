import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('business')
export class BusinessController {
    constructor(private readonly businessService: BusinessService) {}

    @Get()
    findAll(){
        return this.businessService.findAll();
    }

    @Get(':id')
    findOne(@Param('id',ParseIntPipe) id: number){
        return this.businessService.findOne(id)
    }

    @Post()
    create(@Body(ValidationPipe) dto:CreateBusinessDto){
        return this.businessService.create(dto)
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id:number, @Body(ValidationPipe) dto: UpdateBusinessDto){
        return this.businessService.update(id,dto)
    }

    @Delete(':id')
    remove(@Param('id',ParseIntPipe) id:number){
        return this.businessService.remove(id)
    }
}
