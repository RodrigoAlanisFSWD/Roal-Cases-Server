import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { Address } from '../entities/address/address.entity';
import { AddressesService } from './addresses.service';

@Controller('/api/addresses')
export class AddressesController {

    constructor(
        private addressesService: AddressesService
    ) { }

    @UseGuards(AtGuard)
    @Post("/")
    @HttpCode(HttpStatus.CREATED)
    async createAddress(@Body() address: Address, @GetCurrentUser("sub") userId: number): Promise<Address> {
        return this.addressesService.createAddress(address, userId);
    }

    @UseGuards(AtGuard)
    @Get("/")
    @HttpCode(HttpStatus.OK)
    async getAddresses(@GetCurrentUser("sub") userId: number): Promise<Address[]> {
        return this.addressesService.getAddresses(userId)
    }

    @UseGuards(AtGuard)
    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    async getAddress(@Param("id") id: number): Promise<Address> {
        return this.addressesService.getAddress(id)
    }

    @UseGuards(AtGuard)
    @Delete("/:id")
    @HttpCode(HttpStatus.OK)
    async deleteAddress(@Param('id') id: number): Promise<any> {
        return this.addressesService.deleteAddress(id)
    }

    @UseGuards(AtGuard)
    @Put("/")
    @HttpCode(HttpStatus.OK)
    async updateAddress(@Body() address: Address): Promise<any> {
        return this.addressesService.updateAddress(address)
    }
}
