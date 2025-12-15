using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(AppDbContext context) : ILikesRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await context.Likes
            .Where(x => x.SourceMemberId ==memberId)
            .Select(x => x.TargetMemberId)
            .ToListAsync();
    }

    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
       return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PaginatedResults<Member>> GetMemberLikes(LikesParms likesParms)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;

        switch (likesParms.Predicate)
        {
            case "liked":
                result = query
                    .Where(like => like.SourceMemberId == likesParms.MemberId)
                    .Select(like => like.TargetMember);
                break;    
            case "likedBy":
                result = query
                    .Where(like => like.TargetMemberId == likesParms.MemberId)
                    .Select(like => like.SourceMember);
                    break; 
            default: // mutual
                var likeIds = await  GetCurrentMemberLikeIds(likesParms.MemberId);
                result = query
                    .Where(x => x.TargetMemberId == likesParms.MemberId && likeIds.Contains(x.SourceMemberId))
                    .Select(x => x.SourceMember);
                    break; 
        }

        return await PaginationHelper.CreateAsync(result, likesParms.PageNumber, likesParms.PageSize);
    }

    public async Task<bool> SaveAllChanges()
    {
       return await context.SaveChangesAsync() >0;
    }
}
