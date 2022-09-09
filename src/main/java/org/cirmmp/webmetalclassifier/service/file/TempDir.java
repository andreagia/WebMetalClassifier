package org.cirmmp.webmetalclassifier.service.file;

import java.io.IOException;
import java.nio.file.Path;
import java.util.stream.Stream;

public interface TempDir {

    void createDir(String path);
    Stream<Path> getolddir() throws IOException;
    void deleteDir(Path path);

}
