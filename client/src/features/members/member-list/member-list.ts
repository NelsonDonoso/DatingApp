import { Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member, MemberParams } from '../../../Types/member';
import { MembersCard } from '../members-card/members-card';
import { PaginatedResult } from '../../../Types/pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MembersCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit{
  @ViewChild('filterModal') modal!: FilterModal
  private memberService = inject(MemberService)
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null)
  protected memberParams = new MemberParams()
  private updatedParms = new MemberParams()

  constructor(){
    const filters = localStorage.getItem('filters')
    if(filters){
      this.memberParams = JSON.parse(filters)
      this.updatedParms = JSON.parse(filters)
    }
  }


  ngOnInit(): void {
    this.loadMembers()
  }

  loadMembers(){
    this.memberService.getMembers(this.memberParams).subscribe({
      next: result=>{
        this.paginatedMembers.set(result)
      }
    })
  }

  onPageChange(event:{pageNumber: number, pageSize: number}){
    this.memberParams.pageSize = event.pageSize
    this.memberParams.pageNumber = event.pageNumber
    this.loadMembers()
  }

  openModal(){
    this.modal.open()
  }

  onCLose(){
    console.log('modal closed')
  }

  onFilterChange(data: MemberParams){
    this.memberParams = {...data}
    this.updatedParms = {...data}
    this.loadMembers()
  }

  resetFilters(){
    this.memberParams = new MemberParams()
    this.updatedParms = new MemberParams()
    this.loadMembers()
  }

  get displayMessage(): string {
    const defaultParmas = new MemberParams()

    const filters: string[] =[]

    if(this.updatedParms.gender){
      filters.push(this.updatedParms.gender + 's')
    } else {
      filters.push('Males, Females')
    }

    if(this.updatedParms.minAge !== defaultParmas.minAge || this.updatedParms.maxAge !== defaultParmas.maxAge){
      filters.push(`ages ${this.updatedParms.minAge}-${this.updatedParms.maxAge}`)
    }

    filters.push(this.updatedParms.orderBy === 'lastActive' ? 'Recently active': 'Newest members')

    return filters.length > 0 ? `Selected: ${filters.join('  | ')}` : 'All members'
  }
}
