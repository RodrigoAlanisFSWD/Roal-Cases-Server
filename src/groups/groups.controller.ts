import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminGuard, AtGuard } from 'src/common/guards';
import { SubCategory } from 'src/subcategories/subcategory/subcategory.entity';
import { Group } from './group/group.entity';
import { GroupsService } from './groups.service';

@Controller('/api/groups')
export class GroupsController {

    constructor(
        private groupsService: GroupsService
    ) {}

    @Get("/")
    @HttpCode(HttpStatus.OK)
    async getGroups(): Promise<Group[]> {
        return this.groupsService.getGroups()
    }

    @Get("/:groupId")
    @HttpCode(HttpStatus.OK)
    async getGroupSubCategories(@Param("groupId") groupId: number): Promise<SubCategory[]> {
        return this.groupsService.getGroupSubCategories(groupId)
    }

    @UseGuards(AtGuard, AdminGuard)
    @Post("/")
    @HttpCode(HttpStatus.CREATED)
    async createGroup(@Body() group: Group): Promise<Group> {
        console.log(group)
        return this.groupsService.createGroup(group)
    }

    @UseGuards(AtGuard, AdminGuard)
    @Put("/")
    @HttpCode(HttpStatus.OK)
    async updateGroup(@Body() group: Group): Promise<Group> {
        return this.groupsService.updateGroup(group)
    }

    @UseGuards(AtGuard, AdminGuard)
    @Delete("/:groupId")
    @HttpCode(HttpStatus.OK)
    async deleteGroup(@Param("groupId") groupId: number): Promise<Group> {
        return this.groupsService.deleteGroup(groupId)
    }
}
