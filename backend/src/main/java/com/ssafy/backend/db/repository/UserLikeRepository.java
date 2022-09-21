package com.ssafy.backend.db.repository;


import com.ssafy.backend.db.entity.Nft;
import com.ssafy.backend.db.entity.UserLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface UserLikeRepository extends JpaRepository<UserLike, Integer> {
    @Query("select count(u) from UserLike u where u.nft = :nft and (u.isCanceled is null or u.isCanceled = true)")
    Integer getLikeCountOfNft(Nft nft);
    @Query(value = "SELECT * FROM user_like WHERE user_id =? AND nft_id =?", nativeQuery = true)
    Optional<UserLike> findByUserAndNftId(int user_id, int nft_id);
}
