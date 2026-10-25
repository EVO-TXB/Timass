package com.timass.dto;

import com.timass.model.TrangThaiCongViec;
import jakarta.validation.constraints.NotNull;

public class CapNhatTrangThaiDTO {

    @NotNull(message = "Trạng thái công việc không được để trống (DANG_CHO hoặc HOAN_THANH)")
    private TrangThaiCongViec trangThai;

    public CapNhatTrangThaiDTO() {
    }

    public CapNhatTrangThaiDTO(TrangThaiCongViec trangThai) {
        this.trangThai = trangThai;
    }

    public TrangThaiCongViec getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiCongViec trangThai) {
        this.trangThai = trangThai;
    }
}
